import React, { useEffect, useState } from "react";
import MapboxGL from "@rnmapbox/maps";
import * as Location from "expo-location";
import { apiService } from "~/services/apiService";
import { Alert, View, Text } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface MapProps {
  location?: UserLocation | null;
  setLocation?: React.Dispatch<React.SetStateAction<UserLocation | null>>;
}

export default function Map({ location = null, setLocation }: MapProps) {
  const { isDarkColorScheme } = useColorScheme();

  const [mapBoxToken, setMapboxToken] = useState<string>("");
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const getLocationPermission = async () => {
      if (location) {
        setUserLocation(location);
        if (setLocation) {
          setLocation(location);
        }
        return;
      }
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === "granted";
        setLocationPermission(granted);

        if (granted) {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (setLocation) {
            setLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }

          return;
        }

        Alert.alert(
          "Location Permission",
          "Location permission is required to show your current location on the map.",
        );
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    getLocationPermission();
  }, []);

  useEffect(() => {
    const getMapboxToken = async () => {
      const token = await apiService.get("api/v1/map-box/token");
      if (token.status === 200) {
        const accessToken = token.data.data.token;

        setMapboxToken(accessToken);

        if (accessToken && accessToken.startsWith("pk.")) {
          MapboxGL.setAccessToken(accessToken);
          setIsMapReady(true);
          return;
        }

        console.error("Invalid Mapbox token received:", accessToken);

        return;
      }

      console.error("Failed to get token, status:", token.status);
    };

    getMapboxToken();
  }, []);

  if (isMapReady && mapBoxToken) {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 10,
        }}
        className="border border-input"
      >
        <MapboxGL.MapView
          style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}
          styleURL={
            isDarkColorScheme ? MapboxGL.StyleURL.Dark : MapboxGL.StyleURL.Light
          }
        >
          <MapboxGL.Camera
            zoomLevel={15}
            centerCoordinate={
              userLocation
                ? [userLocation.longitude, userLocation.latitude]
                : [-74.006, 40.7128]
            }
            animationMode="flyTo"
            animationDuration={2000}
          />

          {userLocation && (
            <MapboxGL.PointAnnotation
              id="userLocation"
              coordinate={[userLocation.longitude, userLocation.latitude]}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#007AFF",
                  borderRadius: 10,
                  borderWidth: 3,
                  borderColor: "white",
                }}
              />
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>
      </View>
    );
  }

  return (
    <View>
      <Text>Unable to load map</Text>
    </View>
  );
}
