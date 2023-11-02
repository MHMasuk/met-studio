export async function getTemparatureData() {
    const response = await fetch("/mock-data/layer-data/temparature-data.json");
    const movies = await response.json();
    // console.log(movies);
    return movies
}