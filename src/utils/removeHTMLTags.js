export const removeHTMLTags = (text) => {
    return text.replace(/<[^>]+>/g, '');
}
