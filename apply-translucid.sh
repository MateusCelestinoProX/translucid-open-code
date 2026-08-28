#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "🔮 [Translucid OpenCode] Aplicando motor visual v11..."
node "$DIR/generate_clean_engine.js"
node "$DIR/deploy_v11.js"
echo "✨ [Sucesso!] OpenCode configurado!"
open -a /Applications/OpenCode.app
