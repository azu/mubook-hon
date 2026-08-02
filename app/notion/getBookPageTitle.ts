export const getBookPageTitle = (fileName: string): string => {
    const lastPathSeparatorIndex = Math.max(fileName.lastIndexOf("/"), fileName.lastIndexOf("\\"));
    const extensionIndex = fileName.lastIndexOf(".");

    if (extensionIndex <= lastPathSeparatorIndex + 1 || extensionIndex === fileName.length - 1) {
        return fileName;
    }

    return fileName.slice(0, extensionIndex);
};
