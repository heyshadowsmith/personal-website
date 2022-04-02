// Query params:
// 1. quote: Max length of 131 characters

import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'

module.exports = async (req, res) => {
  let quote = req.query.quote

  if (!quote) {
    quote = 'Having nothing, nothing can be shared.'
  }

  if (quote.length > 131) {
    quote = 'Sharing too much is a far greater fault than sharing too little.'
  }

  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Quote Image</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Oswald&family=Roboto:wght@300&display=swap" rel="stylesheet">
      <style>
        body {
          width: 2400px;
          height: 1260px;
          margin: 0;
          background-color: #1e293b;
          color: #fafbff;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .content {
          padding: 148px 200px;
        }

        .quote {
          margin: 0;
          font-family: 'Oswald', sans-serif;
          font-size: 7.5rem;
          line-height: 1.5;
        }

        .logo {
          width: 800px;
          margin: 120px auto 0;
        }

        .website {
          font-family: 'Roboto', sans-serif;
          font-size: 40px;
          letter-spacing: 8px;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <p class="quote">“${quote}”</p>
        <div class="logo">
          <svg viewBox="0 0 502 131" xmlns="http://www.w3.org/2000/svg">
            <path d="M114.6 1.49999C113.7 2.39999 113 3.39999 113 3.79999C113 5.29999 108.8 25.3 106 37.6L102.9 50.6L97.8 52.8C95 54 92.5 54.9 92.4 54.7C92.2 54.6 92.9 50.8 93.9 46.5C97.8 29.8 98 28.6 96.4 26.9C95.6 26.1 95 24.9 95 24.3C95 23.7 94.4 23 93.8 22.7C92.8 22.4 92.8 22 93.9 20.7C95 19.3 95 18.9 93.5 18.4C90 17 88.6 19.4 86.3 30.6C79.7 63.5 78.7 66 71.8 69.6C70.2 70.4 69 71.5 69 72C69 73.6 70.9 74.1 73.1 73C74.9 72 75.1 72.1 74.6 73.7C71.2 84.7 70.1 95 71.6 100.7C73.1 106.2 80.7 101 83.2 92.8C84.1 89.9 85.1 85.5 85.5 83C86.3 78.2 88.7 67.9 89.3 67.3C90.3 66.4 99 62.4 99 62.9C99 63.2 97.4 69.8 95.4 77.5C93.5 85.2 91.6 94.7 91.3 98.6C90.7 106.1 91.6 115 92.9 115C94.2 115 95.9 110.4 95 109C94.5 108.1 94.9 107 96.3 105.9C97.5 104.9 98.1 104.1 97.6 104C97.1 104 97.3 103.3 98 102.5C98.7 101.7 99 100.3 98.6 99.5C98.1 98.2 98.4 98.1 100.1 99.1C102.3 100.2 103.8 98.9 106.5 93.5C107.1 92.4 108.5 91 109.7 90.4C110.9 89.8 114.4 86 117.4 81.8C123.9 72.9 128.7 69.5 135.9 68.5L141.3 67.8L140.7 71.1C140.3 73 139.7 82.1 139.4 91.5L138.7 108.5L133.8 114.5C131.2 117.8 129 120.8 129 121.3C129 122.5 133.2 120.1 136.6 116.8L139.7 113.9L140.4 117.9C141 121.8 143 123.7 143 120.4C143 119.6 143.4 119.1 143.9 119.5C144.5 119.8 145.2 118.4 145.5 116.3C146.4 110.7 146.8 110 148.7 109.3C149.7 108.9 151.2 107.8 152 106.7C154 104.3 159.1 103.7 160.6 105.8C161.7 107.3 162 107.3 163.7 105.8C164.7 104.9 166.2 104 167 103.8C168.9 103.4 171 101.4 171 100.1C171 99.6 171.8 98.5 172.8 97.8C173.9 97.1 175.4 95.1 176.3 93.5C177.1 91.8 178.2 90.6 178.7 90.7C179.1 90.9 179.5 90.4 179.5 89.7C179.6 89.1 180.1 88.6 180.8 88.7C181.5 88.9 182 88.5 182 88C182 87.4 182.6 87 183.3 87C185 87 189.3 81.2 188.5 80C188 79.1 189.5 78.5 190.3 79.2C190.4 79.4 191.7 78.5 193 77.2C195.1 75.3 195.2 74.8 194 74C193 73.3 192.9 73 193.8 73C194.4 73 195 72.5 195 72C195 71.4 194.1 71 193 71C191.3 71 191.2 70.7 192.1 69.2C192.7 68.2 194.1 67.4 195.2 67.4C196.9 67.4 196.9 67.6 195.6 68.6C194.1 69.6 194.1 69.9 195.5 71C196.6 71.9 196.7 72.5 196 73C195.3 73.5 195.4 74.1 196.5 75C197.8 76 198 75.9 198 74.2C198 73.1 198.8 71.6 199.7 70.9C201.2 69.6 201.3 69.8 200.7 72C198.9 78.6 198.8 85.7 200.4 89.2C202.6 93.8 206.3 97.2 209.2 97.3C218.2 97.5 222.6 96.6 226.1 93.8C228.1 92.3 230.4 91 231.1 91C232.4 90.9 237.1 85.3 239.8 80.3C240.5 79.1 241.6 78 242.2 78C242.7 78 243 77.4 242.7 76.6C242.4 75.8 242.4 74.9 242.8 74.6C243.1 74.2 243.5 73 243.7 71.8C243.9 70.6 244.6 68.7 245.4 67.5C246.1 66.4 247.2 63.8 247.9 61.7C248.6 59.7 249.6 58 250.1 58C250.6 58 250.3 59.7 249.5 61.7C248.6 63.7 247.7 68.8 247.4 72.9C247.1 77.1 246.5 82.5 246 85C245.5 87.5 244.8 91.6 244.5 94.2C244 98 243.5 98.9 241.7 99.2C239.9 99.4 239.5 100.1 239.7 102.7C239.9 105.2 239.7 105.8 238.5 105.4C237.7 105 237 105.3 237 105.8C237 106.4 237.9 107.2 239 107.5C240.1 107.8 241 108.9 241 109.8C240.9 111.4 240.8 111.3 239.9 109.7C239.4 108.8 238.4 108 237.8 108C237.2 108 237.9 109.1 239.5 110.5C241.2 112.2 242 113.8 241.7 115C241.4 116.1 241.7 116.8 242.3 116.7C242.9 116.6 243.9 117.6 244.7 119C245.4 120.4 246 120.9 246 120.2C246 119.6 246.9 119 247.9 119C249 119 251 117.5 252.3 115.7C255.5 111.6 263.2 95.3 268.1 82.5C271.3 74 271.9 73 272 76C272.1 77.9 272.3 82.2 272.4 85.5C272.6 88.8 272.8 92.7 272.9 94.2C273 96.5 273.5 97 275.6 97C278.3 97 284 92.2 284 89.9C284 87.5 290.3 76 291.6 76C292.5 76 293 74.8 293 72.7C293 70.8 293.9 66.7 295.1 63.4C297.8 55.5 299.9 46.3 300.5 39.5C301 34.3 300.9 34 298.7 34C296 34 292 36.6 292 38.4C292 39.9 287.8 44 286.2 44C285.5 44 285 45.2 285 46.7C285 48.3 284.7 50.6 284.3 51.9C283.8 54 284 54.2 286.1 53.6L288.5 52.9L286.1 54.8C284.5 56.1 283.9 57.3 284.3 58.4C284.7 59.4 284.6 59.8 284 59.5C283.5 59.2 282.6 59.9 282 61C280.3 64.2 279.3 63.4 278.6 58.1C277.5 49.5 272.8 50.3 267.1 60C264.8 63.8 263 67.2 263 67.7C263 68.1 262.3 69.3 261.6 70.3C260.3 71.9 260.2 71.7 260.7 67.8C260.9 65.4 261.9 60.1 262.8 56C265.3 44.7 265.2 13.2 262.7 6.69999C260.7 1.69999 259 0.299989 259.8 4.49999C260.1 6.19999 259.8 6.99999 258.8 6.99999C257.1 6.99999 257.2 6.59999 256.6 18.2C256.4 22.9 255.6 27.9 254.9 29.2C254.2 30.4 253.7 34.3 253.7 37.7C253.7 41.2 253.4 44 253 44C252 44 252.2 46 253.3 47.7C253.8 48.6 253.6 48.8 252.7 48.4C251.2 47.8 249.4 34.7 250.8 34.2C251.2 34.1 251.4 32.5 251.2 30.6C250.9 28.2 250.1 26.9 248.2 26C240.7 22.5 240.9 22.5 238 24.2C235.2 25.8 235.1 25.8 231.3 22.1C223.7 15 205.1 12.8 191.9 17.6C181.2 21.5 166 28.9 166 30.3C166.1 33.2 167.9 34.1 175.2 34.6C181 34.9 183 34.7 183.9 33.6C184.6 32.8 185.8 32.4 186.5 32.6C187.2 32.9 188.3 32.3 188.9 31.1C189.5 30 193.3 27.5 197.4 25.6C203.4 22.7 206 22 210.8 22C217 22 223 23.5 223 25.1C223 27.5 218.5 34.4 213.3 40.1C207.3 46.6 189.1 62.4 188.4 61.7C188.2 61.5 188.7 59.4 189.5 57C190.3 54.6 191.3 50.4 191.6 47.6C192.3 41.5 190.9 39.7 185.8 40.2C183 40.4 182.2 41.1 180.7 44.5C175.6 55.8 176.1 55.3 168 57.2C157.8 59.5 152 60.3 152 59.3C152 58.9 152.5 56.7 153 54.5C153.6 52.3 154.3 46.9 154.6 42.5C154.9 38.1 155.6 33.8 156.1 32.9C156.5 32 156.7 29.8 156.4 27.9C156.2 26 155.9 22.8 155.9 20.8C155.8 17.2 155.6 17.1 153.1 17.6C149.4 18.5 149 18.9 149 20.9C149 21.9 147.9 23.5 146.5 24.4C145.1 25.3 144 26.6 144 27.3C144 28.1 142.8 29.7 141.4 31.1C140 32.4 134.3 40.6 128.7 49.2L118.6 65H114.3C109.9 65 109.1 64.3 111.2 62.2C111.9 61.5 112.1 61 111.7 61C111.4 61 111.7 59.3 112.4 57.2C113.1 55.2 113.6 52.7 113.4 51.7C113.3 50.8 113.5 50 113.8 50C114.2 50 114.6 49 114.6 47.7C114.9 44 115.8 39.7 117 36.5C117.6 34.8 118.1 33.3 118 33C117.8 31.8 120.5 24 121.2 24C121.6 24 122 23.5 122 22.9C122 22.3 122.7 20.2 123.7 18.3C125 15.6 125 14.6 124.1 14C123.2 13.5 123.1 13.1 123.9 12.6C125.6 11.5 125.2 5.49999 123.3 3.19999C120.8 0.199989 116.7 -0.500011 114.6 1.49999ZM236 28.5C235.3 29.4 234.5 29.8 234.3 29.6C233.6 28.9 235 27 236.2 27C236.8 27 236.8 27.6 236 28.5ZM249 29.8C249 31.3 248.8 31.3 248 30C246.7 28 246.7 26.7 248 27.5C248.6 27.8 249 28.9 249 29.8ZM245 32.8C244.4 33 244 36.2 244 39.9C244 53.5 241.1 62.6 232.5 76.5C227.3 84.9 222.8 88.8 217.8 89.3C214.8 89.6 214 89.2 212 86.4L209.8 83L211.9 78.5C213 76 214 73.3 214 72.4C214 71.5 215.6 68.5 217.5 65.9C219.4 63.2 221 60.5 221 59.9C221 59.3 221.7 58.2 222.5 57.4C223.3 56.5 224 55 224 53.9C224 52.8 224.5 52.2 225 52.5C225.6 52.8 226 52.7 226 52.2C226 51.7 227 50.2 228.3 48.9C235 41.9 237.7 35.8 234.8 34.7C234.1 34.5 234.7 33.9 236.2 33.5C237.7 33.1 239.7 31.7 240.6 30.2L242.3 27.7L244.1 30.1C245.1 31.4 245.5 32.6 245 32.8ZM252.1 53.1C251.6 54.4 251.1 55 251.1 54.3C251 52.8 252.1 49.8 252.6 50.3C252.9 50.5 252.6 51.8 252.1 53.1ZM141.5 56.1C141.3 58.9 141 61.4 140.8 61.5C140.6 61.7 138.3 62.1 135.5 62.4C132.8 62.7 131.1 62.7 131.8 62.4C132.4 62.1 133 61.4 133 60.9C133 60.4 134.5 58.3 136.3 56.3C138 54.4 139.4 52.4 139.3 51.9C139.1 51.4 139.6 51 140.4 51C141.5 51 141.8 52.2 141.5 56.1ZM173.3 61.7C170.5 68.4 163.8 81.5 162.2 83.3C161.4 84.2 161 85.3 161.3 85.7C161.7 86 161.2 86.9 160.2 87.7C159 88.7 158.8 89.3 159.7 89.6C160.7 90 160.7 90.9 159.6 93.5C158.8 95.4 158.6 97.2 159.1 97.7C159.6 98.2 159.3 99.5 158.4 100.8C156.9 103 156.8 103 154.4 101.1C152.1 99.3 148 99.3 148 101.1C148 101.6 147.6 102 147.2 102C146.3 102 147.1 95.3 149.4 83.5C150.2 79.1 150.9 74.5 151 73.2C151 71.9 151.5 70.4 152 69.7C152.6 69 153.6 67.7 154.3 66.6C155.1 65.6 157 64.7 158.7 64.6C160.5 64.5 162.2 64.1 162.6 63.7C163 63.3 163.9 63 164.6 63C165.3 63 167.6 61.9 169.6 60.5C174.6 57.1 175.2 57.3 173.3 61.7ZM201.9 64.4C200.6 67.3 200.2 67.4 198 66C196.8 65.2 197 65 198.9 65C200.2 65 201.1 64.7 200.7 64.4C200.1 63.8 202.2 60.9 202.8 61.5C202.9 61.6 202.5 62.9 201.9 64.4ZM216.3 62.5C216 63.4 215.5 63.9 215.3 63.6C215 63.3 215.1 62.7 215.5 62.1C216.4 60.5 217 60.8 216.3 62.5ZM196 64.4C196 64.6 195.3 65.1 194.4 65.4C193.6 65.7 193.2 65.6 193.5 65C194.1 64 196 63.6 196 64.4ZM281.2 69C281.5 70.7 281.3 72.3 280.8 72.6C280.4 72.9 280 71.5 280 69.6C280 65.2 280.6 64.9 281.2 69ZM112.1 72C113.7 72 113.1 74.1 109.1 80.8C107 84.5 104.4 89.6 103.5 92.2C102.5 94.9 101.3 97 100.8 97C99.7 97 100.7 91.5 102.6 87.9C103.4 86.3 104 84.7 104 84.3C103.9 83.8 104.9 80.3 106.2 76.4C108.1 70.4 108.7 69.5 109.8 70.6C110.5 71.4 111.6 72 112.1 72ZM192 73.5C192 74.3 191.3 75 190.5 75C189.2 75 189.1 74.7 190.2 73.5C191.8 71.7 192 71.7 192 73.5ZM188 77.4C186.6 78.8 185.6 77.4 186.4 75.3C187 73.8 187.2 73.8 188 75C188.6 75.9 188.5 76.9 188 77.4ZM209.9 79.1C208.1 80.2 208 79.9 208.7 77.1C209.2 75 209.4 75 210.3 76.5C210.9 77.7 210.8 78.5 209.9 79.1Z" fill="#fafbff" />
            <path d="M152.6 95.9C152.2 96.6 152.1 97.4 152.4 97.7C153.3 98.6 154.3 97.3 153.8 95.9C153.4 94.8 153.2 94.8 152.6 95.9Z" fill="#fafbff" />
            <path d="M393.2 4.8C389.2 11 378.1 37.7 373.5 52.4C372.4 55.6 371 58.4 370.3 58.7C369.6 59 368.8 60.1 368.4 61.2C367.1 65.6 367.1 61.9 368.6 52.9C371.1 38.1 371.3 32.2 369.4 30.3C368.6 29.4 368.1 27.9 368.3 26.9C368.7 25.5 368.3 25 366.6 25C363.5 25 360.3 27.5 359.5 30.7C357.8 37.6 353.6 48 352.5 48C351.7 48 351.1 50.4 350.7 54.7C350.4 58.5 349 64.9 347.7 69C346.4 73.2 344.9 78.8 344.5 81.5C343.7 86.2 343.6 86.3 343 83.5C341.7 77.9 338.2 72.5 331.7 66.2C322.5 57.4 318.9 52.6 318.3 48.2C317.9 44.9 318.3 43.8 321.7 39.4C326 34 335.1 26 336.9 26C339.2 26 337.8 32.4 333.5 41.2C331 46.3 329 51.2 329 52.2C329 54.7 333.7 55.7 336.9 53.9C340.1 52.1 347 38.9 347 34.4C347 32 347.5 31 348.5 31C349.3 31 350 30.6 350 30.1C350 29.6 349.3 29 348.5 28.6C347.7 28.3 347 27 347 25.8C346.9 22.9 344.5 19.9 339.6 16.6C333.3 12.4 331.6 12.9 321.3 22.8C304.9 38.4 302.7 50.5 313.9 63.2C315.6 65.2 317 67.2 317 67.7C317 68.1 319 70.8 321.5 73.5C326.5 78.9 329 85.1 327.3 87.8C326.8 88.8 320 93.5 312.3 98.5C304.7 103.4 295 110.2 290.9 113.5C286.8 116.8 282.5 120.2 281.2 121C279.6 122.1 279.3 122.9 280 124C280.8 125.3 281 125.2 281 123.6C281 122.2 281.5 121.9 283.1 122.3C284.3 122.6 285.3 122.3 285.7 121.4C286 120.6 286.5 120.2 286.9 120.5C287.3 120.7 289.3 119.5 291.3 117.9C293.8 115.8 295.6 115.1 296.9 115.5C298.2 115.9 299.6 115.4 300.8 114.2C303.7 111.3 319.3 103.6 335 97.4C337.5 96.4 340.3 94.7 341.2 93.5L342.9 91.5L343 93.7C343 95 343.5 96 344 96C346.1 96 351 92.9 351 91.7C351 91 352.6 88 354.5 85C356.4 82 358 79 358 78.5C358 77.9 357.5 78.2 357 79C356.3 80.1 356 79.6 356 77C355.9 73.9 355.8 73.8 355 75.7C353.8 78.6 353.3 78.6 353.5 75.8C353.6 74.6 354.7 73.2 355.9 72.6C357.3 72 357.9 71.1 357.5 70.1C356.8 68.2 356.7 68 356.9 65.8C357 64.7 357.6 64.3 359.2 64.8C360.8 65.2 361.1 65 360.5 64C359.5 62.3 358.9 56 359.6 53.7C360.7 50.2 361.6 52.2 362.8 60.7C363.4 65.6 364.1 70.4 364.2 71.5C364.6 73.9 366.7 74.4 370.3 73.1C372.5 72.2 381.3 60.7 383.3 56C384.2 53.9 383 71.6 381.9 76.9C381.3 79.7 381.3 81.6 381.9 82.4C383.2 83.9 383.2 117.3 381.9 118C381.4 118.4 381.8 121.1 382.7 124.3C384.4 129.8 386 131.8 386 128.3C386 127.4 386.8 125.8 387.7 124.8C388.8 123.5 389.5 120.9 389.7 117.2C390.4 101.3 390.6 99.2 391.3 99.7C391.7 99.9 392 99.4 392 98.5C392 97.4 391.5 97 390.4 97.4C389.6 97.7 389.2 97.6 389.5 97C389.8 96.4 390.8 96 391.6 96C393.2 96 393.5 94.3 392 93.8C391.3 93.6 391.3 92.3 392.1 90C393 87.4 393 86.5 392.2 86.2C391.5 86 391 85.4 391 84.9C391 84.3 391.4 84.1 391.9 84.4C392.4 84.7 393 84.3 393.4 83.5C393.7 82.7 393.6 82 393.2 82C392.8 82 392.4 81.1 392.4 80C392.4 78.9 392.7 78 393 78C393.3 78 393.6 76.1 393.8 73.9C393.9 71.6 394.7 68.5 395.5 66.9C396.3 65.4 397 63.2 397 62C397 60.9 397.4 60 397.9 60C398.3 60 399 55.4 399.4 49.8C399.8 44.2 400.6 38.8 401.1 37.8C401.8 36.5 401.8 35.5 401.1 34.6C400.5 33.9 400.3 33 400.6 32.7C401.4 31.9 402.2 27.4 402.1 24.1C402 22.8 402.4 21.2 402.9 20.6C404.3 18.8 405.1 14 404 14C403.5 14 403 13.5 403 13C403 12.4 403.6 12 404.4 12C405.5 12 405.7 11.1 405.3 8.2C404.7 3.9 402.6 1.5 398.9 0.599999C396.5 0.0999986 395.8 0.599999 393.2 4.8ZM360.7 49.7C360.4 50.7 360.2 49.9 360.2 48C360.2 46.1 360.4 45.3 360.7 46.2C360.9 47.2 360.9 48.8 360.7 49.7Z" fill="#fafbff" />
            <path d="M491.2 0.799992C490.6 1.29999 489.2 5.19999 488.3 9.59999C487.4 13.9 486.1 18.1 485.4 18.9C483.6 20.8 469.8 21.8 470.2 19.9C470.7 17.7 466.3 17.6 465.1 19.8C464.2 21.4 462.5 21.8 452.8 22.4C446.6 22.8 439.8 23.5 437.7 23.9C434.3 24.7 433.8 24.6 433 22.5C432 19.9 430.1 19 425.5 19C421.9 19 419 21.8 419 25.2C419 26.3 418.2 27 417 27C415.3 27 415 27.6 415.1 31.2C415.2 34.1 413.8 39.4 410.7 47.6C408.2 54.2 405.9 61.4 405.6 63.4C405.3 65.5 404.6 67.9 404.1 68.8C402.1 72.8 397.8 92 397.6 97.7C397.5 106 399 107.7 402.9 103.3C404.4 101.6 406.5 98.3 407.5 96.1C408.5 93.8 409.6 92 410.1 92C410.5 92 411.1 90.7 411.5 89.1C411.8 87.5 413.4 84.1 415.1 81.6C416.7 79 418 76.5 418 76.1C418 75.6 418.6 75 419.4 74.7C420.1 74.4 421.1 72.9 421.4 71.3C421.8 69.8 424 65.3 426.2 61.5C429.8 55.2 431.1 51 433.6 37.5C433.8 36.1 435.2 35.1 438 34.3L442.1 33.3L441.5 36.4C441.1 38.1 439.6 44.9 438 51.5C432.8 73 427.8 107.1 429.8 107.8C430.4 108 431 109.3 431 110.6C431 112.6 431.5 113 433.8 113C436.9 113 437 112.9 437.4 105C437.6 102 438.5 97.3 439.4 94.7C440.3 92.1 441 89.1 441 88.1C441 85.1 445.1 73 446 73.5C446.5 73.8 447.9 73.6 449.3 73.1L451.7 72.2L450.3 76.3C447.9 83.2 446.5 95.3 447.6 99.1C448.5 102 449 102.5 451.5 102.3C456.7 101.9 458.3 98.4 463.2 77.5L465.5 67.5L470.5 64.8C473.2 63.3 475.6 62.2 475.7 62.4C475.8 62.5 475.2 64.8 474.4 67.5C473.5 70.3 472.4 74.1 472 76C466.7 99.2 466.3 102.9 467.6 111.3C468.4 115.6 469.9 115.7 471.3 111.6C472 109.6 471.9 108.6 471 108C470.1 107.4 470.4 107 471.9 106.5C473.3 106.1 473.9 105.3 473.6 104.4C473.3 103.7 473.5 102.8 474 102.5C474.6 102.1 475 101 475 100C475 98.7 475.5 98.3 476.5 98.6C478.3 99.3 478.5 97.4 476.8 96.6C475.8 96.1 475.8 95.9 476.8 95.4C477.4 95.1 477.8 94.4 477.4 93.9C476.6 92.6 478.9 86 480.1 86C480.7 86 480.8 85.5 480.5 85C480.2 84.4 481.7 78.5 484 71.7C489.8 54.5 490 53.7 490.4 49.4C490.7 47.2 491.1 44.6 491.4 43.5C491.7 42.4 492.5 39.5 493.1 37C493.7 34.5 495.8 28.7 497.6 24C501.2 15 501.6 13.5 500 14.5C499.5 14.8 499 14.6 499 14.1C499 13.5 499.5 13 500 13C501.8 13 501.2 4.49999 499.3 2.69999C497 0.699992 492.9 -0.300008 491.2 0.799992ZM485 25.3C485 27 479.8 48.5 479.2 49.7C478.4 51 469.1 55.4 468.4 54.7C468.3 54.6 469.2 50.4 470.5 45.5C471.8 40.5 473.2 34.4 473.5 31.7C474.1 27.6 474.6 26.9 476.8 26.4C478.3 26.1 480 25.7 480.5 25.5C481.9 25 485 24.9 485 25.3ZM462.4 32.2C461.6 37.4 461 38.4 461 34.6C461 32.9 460.1 31.1 458.8 29.9L456.5 28.1L459.8 28H463L462.4 32.2ZM459.6 45.2C458.8 48.6 457.6 54.2 456.9 57.5C456.3 60.8 455.1 64.3 454.3 65.2C452.2 67.5 446 71.2 446 70C446 69.6 446.5 69 447 68.8C447.6 68.6 448.5 66 449.1 63C449.6 60 450.4 56.2 450.7 54.7C451 53.1 452.7 50.4 454.5 48.6C456.3 46.8 458.3 43.7 459 41.6C460.9 35.8 461.3 38.1 459.6 45.2Z" fill="#fafbff" />
            <path d="M47.7 23.2C36.8 33.7 34.1 38.4 34 46.8C34 54.1 39.8 64.5 49.9 75.5C54 80 56 86.1 54 88.5C53.3 89.3 46.9 93.6 39.7 98.1C32.4 102.7 23.4 108.9 19.5 112C15.7 115.1 11.1 118.7 9.3 119.9C7 121.5 6.3 122.6 6.8 123.8C7.4 125.4 7.5 125.4 7.8 123.7C8 122.5 8.7 122.1 9.7 122.4C11.1 123 15.3 120.5 19.5 116.7C20.6 115.7 22.3 115.1 23.3 115.4C24.3 115.6 26.3 114.8 27.8 113.6C29.3 112.3 32.5 110.4 35 109.2C42.4 105.8 52.1 101.5 59.3 98.5C63.1 96.9 67 94.5 68.1 93.2C72.9 87.1 68.7 75.5 58.3 66.1C49.3 58 45 51.7 45 46.6C45 42.9 45.6 42 54.1 33.7C61 27 63.5 25.1 64.1 26.1C65.7 28.6 65 31.4 60.5 40.7C58 45.7 56 50.8 56 52C56 54.6 58.3 55.5 62.3 54.3C66.1 53.3 71 45.3 73.1 36.9C73.8 33.9 75.1 31 76 30.3C77.3 29.2 77.3 29.1 75.8 29C74.7 29 74 28.2 74 26.9C74 23.5 71.1 19.6 66.5 16.7C59.9 12.5 58.6 12.9 47.7 23.2Z" fill="#fafbff" />
            <path d="M235 103C235 103.5 235.5 104 236 104C236.6 104 237 103.5 237 103C237 102.4 236.6 102 236 102C235.5 102 235 102.4 235 103Z" fill="#fafbff" />
            <path d="M237 113.5C237 114.3 237.5 115 238 115C238.6 115 239 114.3 239 113.5C239 112.7 238.6 112 238 112C237.5 112 237 112.7 237 113.5Z" fill="#fafbff" />
            <path d="M238 118C238 118.5 238.5 119 239 119C239.6 119 240 118.5 240 118C240 117.4 239.6 117 239 117C238.5 117 238 117.4 238 118Z" fill="#fafbff" />
            <path d="M240 121.5C240 122.3 240.5 123 241 123C241.6 123 242 122.3 242 121.5C242 120.7 241.6 120 241 120C240.5 120 240 120.7 240 121.5Z" fill="#fafbff" />
            <path d="M2.7 125.4C-0.0999979 127.5 0.600002 129.3 3.5 127.4C4.9 126.5 6 125.4 6 124.9C6 123.6 4.8 123.8 2.7 125.4Z" fill="#fafbff" />
            <path d="M275.9 125.9C272.8 128.4 273.8 129.4 277 127C278.4 126 279.2 124.9 278.9 124.5C278.6 124.2 277.2 124.8 275.9 125.9Z" fill="#fafbff" />
          </svg>
        </div>
        <p class="website">shadowsmith.com</p>
      </div>
    </body>
  </html>`

  const options = process.env.AWS_REGION
    ? {
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: chromium.headless
      }
    : {
        args: [],
        executablePath:
          process.platform === 'win32'
            ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            : process.platform === 'linux'
              ? '/usr/bin/google-chrome'
              : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      }

  const browser = await puppeteer.launch(options)

  const page = await browser.newPage()

  await page.setViewport({
    width: 2400,
    height: 1260
  })

  await page.setContent(html, {
    waitUntil: 'networkidle0'
  })

  const file = await page.screenshot({
    type: 'png'
  })

  await browser.close()

  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000')

  return res.end(file)
}
