FROM ubuntu

RUN apt-get update && apt-get install -y \
  curl \
  git \
  openssh-client \
  build-essential \
  ca-certificates

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/mise/shims:$PATH"
RUN curl https://mise.run | sh

WORKDIR /workspace
COPY . .

RUN mise install

CMD [ "bash" ]
