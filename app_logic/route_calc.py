from app_logic.point import Point
from random import randrange
import urllib.request
import simplejson
import math


# returns a list that contains destination and the bearing calculated.
# get_dest()[0] = dest
# get_dest()[1] = brng
def get_dest(origin: Point, minAngle: float, maxAngle: float, dist):
    # get the waypoint of longitude and latitude based on origin point and distance
    radius = 6378.1  # radius of the earth in km
    lat1 = math.radians(origin.latitude)
    lon1 = math.radians(origin.longitude)
    brng = randrange(minAngle, maxAngle)

    distance = dist / 2

    dest = Point()

    # calculate new distance
    dest.latitude = math.asin(math.sin(lat1) * math.cos(distance / radius) +
                              math.cos(lat1) * math.sin(distance / radius) * math.cos(brng))

    dest.longitude = lon1 + math.atan2(math.sin(brng) * math.sin(distance / radius) * math.cos(lat1),
                                       math.cos(distance / radius) - math.sin(lat1) * math.sin(dest.latitude))

    # convert coordinates to degrees
    dest.latitude = math.degrees(dest.latitude)
    dest.longitude = math.degrees(dest.longitude)

    # round coordinates to 6 decimal places
    dest.latitude = round(dest.latitude, 6)
    dest.longitude = round(dest.longitude, 6)

    return [dest, brng]


# returns a JSON of the waypoints
def get_route(latitude, longitude, dist):
    origin = Point()
    origin.longitude = longitude
    origin.latitude = latitude

    # get the waypoint of longitude and latitude based on origin point and distance

    tmp = get_dest(origin, 0, 360, dist / 2)
    waypoint1 = tmp[0]
    tmp = get_dest(origin, tmp[1] - 35, tmp[1] + 35, dist / 2)
    waypoint2 = tmp[0]

    # construct a url for an API request
    url = str.format(
        "https://maps.googleapis.com/maps/api/directions/json?origin={0},{1}&destination={2},{3}&waypoints={4},{5}|{6},{7}&mode=walking&key=AIzaSyC3x3m9LAA_Fspag4uvBzX02pccBlsbUlc",
        origin.latitude, origin.longitude,
        origin.latitude, origin.longitude,
        waypoint1.latitude, waypoint1.longitude,
        waypoint2.latitude, waypoint2.longitude
    )

    # open url and receive json
    req = urllib.request.Request(url)
    requests = urllib.request.urlopen(req).read()

    req = simplejson.dumps(requests.get(url).json(), cls=simplejson.encoder.JSONEncoderForHTML)
    return req
