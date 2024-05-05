#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

readonly repository="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
readonly ENV="prod"
source "$repository/scripts/common.sh"

function main() {
    required_command npm

    pushd "$repository"

    echo "::group::Installing node and dependencies"
    check_node_version
    npm_ci
    echo "::endgroup::"

    echo "::group::Building application"
    npm run build
    echo "::endgroup::"

    popd
}

main "$@"