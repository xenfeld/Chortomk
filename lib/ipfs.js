import axios from "axios";

const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    form,
    { headers: { Authorization: `Bearer ${JWT}` } }
  );

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}

export async function uploadMetadata(metadata) {
  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    { headers: { Authorization: `Bearer ${JWT}` } }
  );

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}
