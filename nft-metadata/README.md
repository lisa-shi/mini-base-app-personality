# NFT Metadata Files

These JSON files define the metadata for each Crypto Personality NFT.

## How to Use

1. **Create or Generate Images**: Create unique images for each personality type (Bitcoin, Ethereum, Solana, Dogecoin). You can:
   - Design them in Figma, Photoshop, or Illustrator
   - Use AI image generators (DALL-E, Midjourney, Stable Diffusion)
   - Commission an artist
   - Use the gradient backgrounds from the app with the personality symbols

2. **Upload Images to IPFS**: 
   - Go to [Pinata.cloud](https://pinata.cloud) or [NFT.Storage](https://nft.storage)
   - Upload each image
   - Copy the IPFS CID (Content Identifier)

3. **Update Metadata Files**:
   - Replace `YOUR_BITCOIN_IMAGE_CID` with the actual CID
   - Do this for all four personality types
   - Update `external_url` with your actual app URL

4. **Upload Metadata to IPFS**:
   - Upload each JSON file to IPFS
   - Copy the CIDs

5. **Update Contract Config**:
   - Open `lib/contractConfig.ts`
   - Update the `NFT_METADATA_URIS` object with your metadata CIDs

## Image Recommendations

- **Size**: 1000x1000px or larger (square format)
- **Format**: PNG or JPEG (PNG preferred for transparency)
- **File Size**: Under 10MB
- **Style**: Match the app's cute, colorful aesthetic

## Example Image Ideas

### Bitcoin
- Golden coin with ₿ symbol
- Secure vault or safe
- Mountain representing stability
- Orange gradient background with sparkles

### Ethereum
- Diamond or crystal shape with ⟠ symbol
- Building blocks or construction elements
- Blueprint or schematic design
- Blue/purple gradient with innovation vibes

### Solana
- Lightning bolt or speed lines with ◎ symbol
- Racing car or rocket
- Neon lights and futuristic elements
- Green/purple gradient with energy effects

### Dogecoin
- Cute Shiba Inu dog with Ð symbol
- Party elements (confetti, balloons)
- Memes and fun graphics
- Gold/yellow gradient with playful vibes

## Metadata Structure

Each JSON file follows the OpenSea metadata standard:

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "ipfs://CID",
  "external_url": "https://your-app.com",
  "attributes": [
    {
      "trait_type": "Trait Category",
      "value": "Trait Value"
    }
  ],
  "properties": {
    "custom_property": "value"
  }
}
```

## Testing

Before deploying to mainnet:
1. Upload test images and metadata to IPFS
2. Deploy contract to testnet
3. Mint a test NFT
4. Verify it appears correctly in your wallet and on OpenSea testnet
5. Check that all metadata displays properly

## Resources

- [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)
- [Pinata - IPFS Upload](https://www.pinata.cloud/)
- [NFT.Storage - Free IPFS](https://nft.storage/)
- [IPFS Documentation](https://docs.ipfs.tech/)

