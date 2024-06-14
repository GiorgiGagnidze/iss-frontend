export const fetchLocation = async () => {
  try {
    const response = await fetch("http://localhost:3000/iss");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
  return null;
};
