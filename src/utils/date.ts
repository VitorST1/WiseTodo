function getCurrentDate(pattern: string): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    let formattedDate = pattern.replace("yyyy", String(year))
    formattedDate = formattedDate.replace("mm", month)
    formattedDate = formattedDate.replace("dd", day)

    return formattedDate
}

export default { getCurrentDate }