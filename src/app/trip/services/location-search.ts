import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TripLocationSearch } from '../interfaces/trip';

@Injectable({
  providedIn: 'root'
})
export class LocationSearchService {

  private autocompleteService!: google.maps.places.AutocompleteService;
  private placesService!: google.maps.places.PlacesService;
  private detailsCache = new Map<string, TripLocationSearch>();

  init() {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    const mapDiv = document.createElement('div');
    this.placesService = new google.maps.places.PlacesService(
      new google.maps.Map(mapDiv)
    );
  }

  // 搜尋地點，回傳下拉清單
  search(keyword: string): Observable<TripLocationSearch[]> {
    if (typeof google !== 'undefined' && !this.autocompleteService) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    }
    return new Observable(observer => {
      if (!keyword || keyword.length < 2) {
        observer.next([]);
        observer.complete();
        return;
      }

      this.autocompleteService.getPlacePredictions(
        { input: keyword, language: 'zh-TW', componentRestrictions: { country: 'tw' } },
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

  //預先抓取地點的資訊 減少等待時間
  prefetchDetails(results: TripLocationSearch[]) {
    results.forEach(result => {
      if (result.placeId && !this.detailsCache.has(result.placeId)) {
        this.getDetails(result).subscribe();
      }
    });
  }

  // 選擇地點後取得完整資訊
  getDetails(result: TripLocationSearch): Observable<TripLocationSearch> {
    if (this.detailsCache.has(result.placeId!)) {
      return new Observable(observer => {
        observer.next(this.detailsCache.get(result.placeId!)!);
        observer.complete();
      });
    }

    return new Observable(observer => {
      this.placesService.getDetails(
        {
          placeId: result.placeId!,
          fields: ['geometry', 'address_components']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            const components = place.address_components || [];
            const cityComp = components.find(c => c.types.includes('administrative_area_level_1'));
            const districtComp = components.find(c =>
              c.types.includes('administrative_area_level_2') || c.types.includes('locality')
            );

            const detail = {
              ...result,
              lat,
              lng,
              cityName: cityComp?.long_name ?? '',
              districtName: districtComp?.long_name ?? '',
            };

            this.detailsCache.set(result.placeId!, detail);
            observer.next(detail);
          } else {
            observer.error('無法取得地點資訊');
          }
          observer.complete();
        }
      );
    });
  }
}
