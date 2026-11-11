const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

export const formatDate = (date: string | Date | number) => {
    const d = new Date(date);
    return Number.isNaN(d.getTime()) ? "" : formatter.format(d);
};