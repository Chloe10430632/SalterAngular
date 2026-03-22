import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TripLocationSearch } from '../interfaces/trip';

@Injectable({
  providedIn: 'root'
})
export class LocationSearchService {

  private autocompleteService!: google.maps.places.AutocompleteService;
  private placesService!: google.maps.places.PlacesService;

  init() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    const mapDiv = document.createElement('div');
    this.placesService = new google.maps.places.PlacesService(
      new google.maps.Map(mapDiv)
    );
  }

  // 搜尋地點，回傳下拉清單
  search(keyword: string): Observable<TripLocationSearch[]> {
    return new Observable(observer => {
      if (!keyword || keyword.length < 2) {
        observer.next([]);
        observer.complete();
        return;
      }

      this.autocompleteService.getPlacePredictions(
        { input: keyword, language: 'zh-TW' },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            const results: TripLocationSearch[] = predictions.map(p => ({
              id: 0,
              placeId: p.place_id,
              name: p.structured_formatting.main_text,
              addressText: p.structured_formatting.secondary_text,
              lat: 0,
              lng: 0
            }));
            observer.next(results);
          } else {
            observer.next([]);
          }
          observer.complete();
        }
      );
    });
  }

  // 選擇地點後取得完整資訊（座標、城市、區域）
  getDetails(result: TripLocationSearch): Observable<TripLocationSearch> {
    return new Observable(observer => {
      this.placesService.getDetails(
        { placeId: result.placeId!, fields: ['geometry', 'name', 'address_components', 'formatted_address'] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            const components = place.address_components || [];
            const cityComp = components.find(c => c.types.includes('administrative_area_level_1'));
            const districtComp = components.find(c =>
              c.types.includes('administrative_area_level_2') || c.types.includes('locality')
            );

            observer.next({
              ...result,
              lat,
              lng,
              cityName: cityComp?.long_name ?? '',
              districtName: districtComp?.long_name ?? '',
              addressText: place.formatted_address ?? result.addressText
            });
          } else {
            observer.error('無法取得地點資訊');
          }
          observer.complete();
        }
      );
    });
  }
}
