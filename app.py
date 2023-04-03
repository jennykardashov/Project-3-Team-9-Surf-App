import numpy as np
from flask import Flask, render_template
import os
import psycopg2

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask_cors import CORS
from flask import Flask, jsonify

# reflect an existing database into a new model
engine = create_engine("sqlite:///surf.sqlite") 
# , pool_pre_ping=True)
Base = automap_base()
Base.prepare(autoload_with=engine)
Surf = Base.classes.current_surf
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)
#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/surf<br/>"
    )

@app.route('/api/v1.0/surf')
def names():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all surf data"""
    # Query all passengers
    results = session.query(Surf.index,Surf.spot,Surf.longitude,Surf.latitude,Surf.spot_id,Surf.wind_speed,Surf.wind_direction,
        Surf.wave_height,Surf.air_temp,Surf.water_temp,Surf.cloud_cover,Surf.gust,Surf.precipitation,Surf.visibility,Surf.wave_direction).all()

    session.close()

    surf_table = []
    for index, spot, longitude, latitude, spot_id, wind_speed, wind_direction, wave_height, air_temp, water_temp, cloud_cover, gust, precipitation, visibility, wave_direction in results:
        surf_dict = {}
        surf_dict["index"] = index
        surf_dict["spot"] = spot
        surf_dict["longitude"] = longitude
        surf_dict["latitude"] = latitude
        surf_dict["spot_id"] = spot_id
        surf_dict["wind_speed"] = wind_speed
        surf_dict["wind_direction"] = wind_direction
        surf_dict["wave_height"] = wave_height
        surf_dict["air_temp"] = air_temp
        surf_dict["water_temp"] = water_temp
        surf_dict["cloud_cover"] = cloud_cover
        surf_dict["gust"] = gust
        surf_dict["precipitation"] = precipitation
        surf_dict["visibility"] = visibility
        surf_dict["wave_direction"] = wave_direction
        surf_table.append(surf_dict)

    return jsonify(surf_table)

if __name__ == '__main__':
    app.run()
