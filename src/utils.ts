import { Http } from "@nativescript/core";

const translate = async (voiceText) => {
  const text = encodeURIComponent(voiceText);

  const url = `${process.env.TRANSLATION_API_URL}/v1/translate?text=${text}&to=es&from=en`;
  const headers = {
    "X-RapidAPI-Key": process.env.TRANSLATION_API_KEY ?? "",
    "X-RapidAPI-Host": process.env.TRANSLATION_X_HEADER ?? "",
  };

  const response = await Http.request({
    url,
    method: "GET",
    headers,
  });

  return response.content?.toJSON();
};

export { translate };
