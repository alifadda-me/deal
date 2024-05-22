export default interface PropertyRepo {
  createPropertyRequest(propertyRequest);
  createAd(add);
  refreshPropertyRequests();
  updatePropertyRequest(propertyRequest);
  findPropertyRequestById(id);
}
