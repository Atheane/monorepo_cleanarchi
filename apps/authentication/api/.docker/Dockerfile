
# Dockerfile
# specify the builder ("builder" can be any tag)
FROM mcr.microsoft.com/windows/servercore:ltsc2019 as builder
# set the environment information
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 8.12.0
ENV GIT_VERSION 2.19.0
ENV USER "vsts"

# create and set the working directory
RUN mkdir "C:/app"
#RUN mkdir "C:/app/node_modules"
#RUN mkdir "C:/app/dist"
WORKDIR "C:/app"

# install git and delete the install file
#COPY "Git-2.19.0-64-bit.exe" git.exe
#RUN git.exe /VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS /COMPONENTS="icons,ext\reg\shellhere,assoc,assoc_sh"
#RUN del git.exe

# install node and delete the install file
COPY apps/authentication/api/.docker/node-v14.7.0-x86.msi  node.msi

### Optionally, the installer could be downloaded as follows (not recommended)
# Invoke-WebRequest $('https://nodejs.org/dist/v{0}/node-v{0}-x64.msi' -f $env:NODE_VERSION) -OutFile 'node.msi'
RUN msiexec.exe /q /i node.msi
RUN del node.msi

# here is where the app directory (including package.json and index.js files) is copied

#COPY node_modules "C:/app/node_modules"
#COPY dist "C:/app/dist"
COPY . "C:/app"

COPY .npmrc .npmrc
#RUN npm install -g yarn
#RUN yarn global add windows-build-tools
#RUN yarn install --frozen-lockfile
#fixme use yarn and find a way with devops team to enhance build time.
RUN npm install
RUN npx nx build authentication-api --with-deps --prod
RUN node --version

EXPOSE 3004 2222
#ENTRYPOINT  ["\"C:/Program Files/nodejs/node.exe\"", "C:/app/app.js"]
ENTRYPOINT  ["node", "dist/apps/authentication/api/main.js"]

### Optionally, you can globally set the proxy server
# ENV http_proxy "http://proxy:port"
# ENV https_proxy "http://proxy:port"

# falling back to the npm http registry overcomes some issues with proxy servers
# RUN npm config set strict-ssl false
# RUN npm config set registry "http://registry.npmjs.org/"
# if the proxy is not globally specified, npm can accept the declaration directly
# RUN npm config set proxy "http://proxy:port"
# RUN npm config set https-proxy "http://proxy:port"
#######  RUN npm install
# Optionally, npm can be used to install packages without package.json
# RUN npm install express
# RUN npm install ip

### Optionally, you can remove the proxy declaration
# ENV http_proxy ""
# ENV https_proxy ""

# now make the target image
# FROM mcr.microsoft.com/windows/nanoserver:1809
# COPY --from=builder ["C:/Program Files/nodejs", "C:/Program Files/nodejs"]
##### COPY --from=builder ["C:/Program Files/Git", "C:/Program Files/Git"]
# COPY --from=builder ["C:/app", "C:/app"]

# Add the command and bin directories to the environment path
# ENV PATH "C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;C:\\Program Files\\nodejs;C:\\Users\\ContainerAdministrator\\AppData\\Roaming\\npm;C:\\Program Files\\Git\\cmd"
### Optionally, the path could have been set referencing the previous path
# ARG SETX=/M
# RUN setx %SETX% PATH "%PATH%;C:\\Program Files\\nodejs;C:\\Users\\ContainerAdministrator\\AppData\\Roaming\\npm;C:\\Program Files\\Git\\cmd"
# RUN setx %SETX% PATH "%PATH%;C:\\Program Files\\nodejs"

### If the image is not referenced, node can be started in this image, otherwise comment this out
# EXPOSE 3004 2222
#ENTRYPOINT  ["\"C:/Program Files/nodejs/node.exe\"", "C:/app/app.js"]
# ENTRYPOINT  ["node.exe", "C:/app/dist/apps/authentication/api/main.js"]
