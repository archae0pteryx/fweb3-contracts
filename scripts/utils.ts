import fs from 'fs-extra'

const writeAddressToFile = (fileName: string, address: string): void => {
  const path = `deploy_addresses/${process.env.SAVE_PATH}/${fileName}`
  fs.writeFileSync(path, address)
  console.log(`wrote ${fileName} address to ${path}`)
}

export { writeAddressToFile }
