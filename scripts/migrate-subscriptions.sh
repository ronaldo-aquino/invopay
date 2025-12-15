#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SQL_FILE="$PROJECT_ROOT/backend/supabase/supabase-migration-subscriptions.sql"

showManualInstructions() {
  echo "📋 Manual Migration Instructions:"
  echo "=================================="
  echo ""
  echo "1. Open Supabase Dashboard: https://supabase.com"
  echo "2. Select your project"
  echo "3. Go to SQL Editor (left sidebar)"
  echo "4. Copy and paste the contents of:"
  echo "   $SQL_FILE"
  echo ""
  echo "   Or run this command to view the SQL:"
  echo "   cat $SQL_FILE"
  echo ""
  echo "5. Click 'Run' in SQL Editor (or press Ctrl+Enter)"
  echo ""
  echo "📄 SQL file location:"
  echo "   $SQL_FILE"
  echo ""
}

echo "🚀 Subscription Migration Script"
echo "=================================="
echo ""

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
  echo "✅ Supabase CLI found"
  echo "📊 Running migration with Supabase CLI..."
  echo ""
  
  cd "$PROJECT_ROOT"
  
  # Check if supabase project is linked
  if [ -f "supabase/.temp/project-ref" ] || [ -n "$SUPABASE_PROJECT_REF" ]; then
    echo "📝 Executing SQL migration..."
    supabase db execute --file "$SQL_FILE"
    echo ""
    echo "✅ Migration completed!"
  else
    echo "⚠️  Supabase project not linked"
    echo "   Run: supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    showManualInstructions
  fi
else
  echo "⚠️  Supabase CLI not found"
  echo ""
  showManualInstructions
fi


