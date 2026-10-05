from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from backend.routers.auth import current_user
from backend.schemas import TripCreate, TripPublic, TripUpdate
from backend.store import StoredTrip, StoredUser, store

router = APIRouter()


def public(trip: StoredTrip) -> TripPublic:
    return TripPublic(id=trip.id, owner_id=trip.owner_id, title=trip.title, destination=trip.destination, start_date=trip.start_date, end_date=trip.end_date, travelers=trip.travelers, version=trip.version)


@router.get("", response_model=list[TripPublic])
def list_trips(user: StoredUser = Depends(current_user)) -> list[TripPublic]:
    return [public(trip) for trip in store.trips.values() if trip.owner_id == user.id or user.id in trip.travelers]


@router.post("", response_model=TripPublic, status_code=201)
def create_trip(payload: TripCreate, user: StoredUser = Depends(current_user)) -> TripPublic:
    if payload.end_date < payload.start_date:
        raise HTTPException(status_code=422, detail="End date precedes start date")
    trip = StoredTrip(str(uuid4()), user.id, payload.title, payload.destination, payload.start_date, payload.end_date, list(dict.fromkeys([user.id, *payload.travelers])))
    store.trips[trip.id] = trip
    return public(trip)


@router.patch("/{trip_id}", response_model=TripPublic)
def update_trip(trip_id: str, payload: TripUpdate, user: StoredUser = Depends(current_user)) -> TripPublic:
    trip = store.trips.get(trip_id)
    if not trip or trip.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Trip not found")
    if payload.version != trip.version:
        raise HTTPException(status_code=409, detail="Trip changed by another collaborator")
    if payload.title is not None: trip.title = payload.title
    if payload.destination is not None: trip.destination = payload.destination
    if payload.travelers is not None: trip.travelers = list(dict.fromkeys([trip.owner_id, *payload.travelers]))
    trip.version += 1
    return public(trip)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(trip_id: str, user: StoredUser = Depends(current_user)) -> None:
    trip = store.trips.get(trip_id)
    if not trip or trip.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Trip not found")
    del store.trips[trip_id]
