function getProperties() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  return {
    geminiApiKey: properties['GOOGLE_API_KEY']
  };
}
