#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Deploy Edge Functions to Supabase
echo "Deploying Edge Functions..."
supabase functions deploy generate-code --project-ref msqyjrpkylernifouxct

# Deploy frontend
echo "Deploying frontend..."
npm run deploy