# 기존 Nginx 구성 파일을 컨테이너 내의 /etc/nginx/로 복사합니다.
#FROM node:latest as build
#WORKDIR /app
#COPY ./build/index.html ./build

# 두 번째 단계: Nginx를 사용하여 애플리케이션 서빙
#FROM nginx:latest
#WORKDIR /
#COPY --from=build app/build /usr/share/nginx/html
#EXPOSE 80 


FROM node:latest
WORKDIR /app
COPY ./build .

FROM nginx:latest
COPY --from=0 /app /usr/share/nginx/html
EXPOSE 80  
