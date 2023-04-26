#!/usr/bin/env bash

: Tune shell options && {
    set -o errexit
    set -o nounset
    set -o pipefail
    set -o xtrace
}

: Deploy && {
    readonly FIREBASE_PROJECT_ID="compro-quizhub"

    # build files
    npm run build --prod --aot

    # deploy to hosting
    firebase use "${FIREBASE_PROJECT_ID}"
    firebase deploy -m "frontend hosting" --only hosting
}
