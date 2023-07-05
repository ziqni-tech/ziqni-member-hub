export const removeHTMLTags = (text) => {
    return text ? text.replace(/<[^>]+>/g, '') : '';
}
