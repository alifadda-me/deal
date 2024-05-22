export default interface PropertyRepo {
  findPropertyRequestByAdIdPaginated(adId: string, page: number, limit: number);
  getStats();
  getPropertyRequestsFiltered(filterQuery);
  getAdsFiltered(filterQuery);
}
