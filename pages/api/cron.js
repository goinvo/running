import { standardizePageId } from "../../utils/format";
import { getFileList } from "../../utils/data";

// sleep function 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  const [fileList, client] = await getFileList(true);
  const urls = fileList.map((item) => {
    return `https://running.goinvo.com/${standardizePageId(item.name)}`;
  })
  urls.push('https://running.goinvo.com');
  urls.push('https://running.goinvo.com/index');

  const CYCLES = 4;

  for (let i = 0; i < CYCLES; i++) {
    setTimeout(async () => {
      for (const url of urls) {
        console.log('visiting ' + url);
        await fetch(url);
      }
    }, i * 1500);
  }

  // Forced delay for all cycles to complete
  await sleep(30_000);

  res.status(200).end('Good!');
}
