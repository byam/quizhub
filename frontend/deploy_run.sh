#!/usr/bin/env bash

: Tune shell options && {
    set -o errexit
    set -o nounset
    set -o pipefail
    set -o xtrace
}

: Deploy && {
    readonly GCP_PROJECT_ID="compro-quizhub"
    readonly REGION="us-central1"
    readonly SERVICE_NAME="compro-quizhub-frontend"
    readonly TAG=latest

    # Container Image Registry
    readonly IMAGE_NAME="asia.gcr.io/${GCP_PROJECT_ID}/${SERVICE_NAME}:${TAG}"

    # deploy
    gcloud --project "${GCP_PROJECT_ID}" run deploy "${SERVICE_NAME}-v1" \
        --image "${IMAGE_NAME}" \
        --platform managed \
        --region "${REGION}" \
        --allow-unauthenticated
}
