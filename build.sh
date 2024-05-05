#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail +e

readonly repository="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
readonly ENV="prod"
source "$repository/scripts/common.sh"

function main() {
    pushd "$repository"
    get_environment_variables

    check_node_version
    npm_ci

    echo "::group::Building application"
    npm run build
    echo "::endgroup::"

    popd
}

main "$@"