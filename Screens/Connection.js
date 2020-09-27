export function getData(port, path, setData, setLoading, setPort) {
  fetch('http://93.79.41.156:' + port + '/' + path)
    .then((response) => response.json())
    .then((json) => setData(json))
    .catch((error) =>
      getData(port === 3000 ? 3200 : 3000, path, setData, setLoading, setPort),
    )
    .finally(() => {
      setPort(port);
      setLoading(false);
    });
}
