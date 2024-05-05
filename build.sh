#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail +e

readonly repository="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
readonly ENV="prod"
source "$repository/scripts/common.sh"

function main() {
    required_command docker
    required_command docker compose

    pushd "$repository"
    get_environment_variables

    echo "::group::Building application"
    npm run build
    echo "::endgroup::"

    popd
}

main "$@"