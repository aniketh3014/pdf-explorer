export const dbAction = async ({file_key, file_name}:{file_key: string, file_name: string}) => {
    // this will store the file_key and file_name in the database
    try {
        // store in the database
        console.log(file_key, file_name);
    } catch(error) {
        console.log('error while storing the vectors',error);
    }
}