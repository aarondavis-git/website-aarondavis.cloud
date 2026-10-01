import fs from 'fs';
import { getVaultAsset, getVaultAssetNames } from '../../../lib/content';

// Serves images embedded in vault notes (![[diagram.png]]). Only image files
// that the vault index found are served — the name is looked up in that
// index, never joined onto a path, so nothing outside the vault is reachable.
export const dynamic = 'force-static';

export function generateStaticParams() {
  return getVaultAssetNames().map((name) => ({ name }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let decoded = name;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    // keep the raw value
  }
  const asset = getVaultAsset(decoded) ?? getVaultAsset(name);
  if (!asset) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(fs.readFileSync(asset.fullPath)), {
    headers: {
      'Content-Type': asset.contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
