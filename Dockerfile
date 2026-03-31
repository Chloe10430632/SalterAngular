# 階段 1：編譯 Angular
FROM node:20-alpine AS build
WORKDIR /app

# 安裝 Angular CLI (確保雲端環境有指令可用)
RUN npm install -g @angular/cli

# 先複製 package.json 下載套件 (利用快取加速)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 複製其餘程式碼並編譯
COPY . .
RUN npx ng build --configuration production

# 階段 2：使用 Nginx 運行
FROM nginx:stable-alpine

# 刪除 Nginx 預設網頁，並從編譯階段把檔案拷貝過來
# 注意：dist/ 後面的資料夾名稱通常跟你的專案名稱一樣，請檢查一下
COPY --from=build /app/dist/salter/browser /usr/share/nginx/html

# 曝露 80 Port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
