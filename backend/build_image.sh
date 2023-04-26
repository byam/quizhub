#!/usr/bin/env bash

: Tune shell options && {
    set -o errexit
    set -o nounset
    set -o pipefail
    set -o xtrace
}

: Build && {
    readonly GCP_PROJECT_ID="compro-quizhub"
    readonly SERVICE_NAME="compro-quizhub-backend"
    readonly TAG=latest
    readonly IMAGE_NAME="asia.gcr.io/${GCP_PROJECT_ID}/${SERVICE_NAME}:${TAG}"

    gcloud --project "${GCP_PROJECT_ID}" builds submit --tag "${IMAGE_NAME}" --timeout=30m
}
