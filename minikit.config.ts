const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    // Will be filled after deploying to Vercel and signing manifest
    header: "eyJmaWQiOjEzNzM3MTcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0NDc3MkNFQ0UwRWIxNTVhYjg5NDZGQjZjZUNDMjRjMjJlOEYyMjc0In0",
    payload: "eyJkb21haW4iOiJtaW5pLWJhc2UtYXBwLXBlcnNvbmFsaXR5LnZlcmNlbC5hcHAifQ",
    signature: "MHg4YTE5ZGIxM2E1NjEwZGYzZDZhNzA5NzQ1Y2NkMjk1MDRhNGMwM2NhMjA4NzNkZGFmMzRhNzYzYjI4ZDJhZTM0MjAwZWM0MTIwZjAzYWE0ZjQ2NTJhZjljNWM4ODgyNGQxNWU5MGM5ODRkMmVlYjI5ZTNjZjZkMTBhNDIxNmMwMDFj"
  },

  miniapp: {
    version: "1",
    name: "Crypto Personality Quiz", 
    subtitle: "Discover Your Crypto Personality", 
    description: "Take this fun quiz to find out which cryptocurrency matches your personality! Are you Bitcoin, Ethereum, Solana, or Dogecoin? Complete the quiz and mint your personality NFT onchain.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/hero.png`,
    splashBackgroundColor: "#667eea",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["quiz", "nft", "blockchain", "personality", "crypto", "web3"],
    heroImageUrl: `${ROOT_URL}/hero.png`, 
    tagline: "Find Your Crypto Spirit Animal",
    ogTitle: "Crypto Personality Quiz - Discover Your Crypto Identity",
    ogDescription: "Are you Bitcoin, Ethereum, Solana, or Dogecoin? Take this fun personality quiz and mint your result as an NFT!",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
  baseBuilder: {
    allowedAddresses: ["0x5F3Af46348372BC4C01451e5a7CC7a90C4CEc226","0xc4F3feCD7b2Dd7061bF505626235a1Df078F205D"]
  },
  redirects: [
    {
      "source": "/.well-known/farcaster.json",
      "destination": "https://api.farcaster.xyz/miniapps/hosted-manifest/0199ca58-4634-4762-8c61-26d4e266e779",
      "permanent": false
    }
  ]
  

} as const;