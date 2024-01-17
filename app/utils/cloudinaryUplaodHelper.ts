import {
  getCloudConfig,
  getCloudSignature,
} from "@app/(admin_routes)/products/action";

export const uplaodImage = async (file: File) => {
  const { name, key } = await getCloudConfig();
  const { signature, timestamp } = await getCloudSignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", key);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());

  const endpoint = `https://api.cloudinary.com/v1_1/${name}/image/upload`;

  const res = await fetch(endpoint, {
    method: "POST",
    // JSON.stringify 로 serialize 하지 않아도 formData 자체가 serial 이다
    body: formData,
  });

  const { public_id, secure_url } = await res.json();

  return { id: public_id, url: secure_url };
};
