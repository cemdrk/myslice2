##
#   MySlice version 2
#
#   Users thread workers
#
#   (c) 2016 Ciro Scognamiglio <ciro.scognamiglio@lip6.fr>
##

import logging
import time
import myslice.db as db
from myslice.lib import Status

from myslice.lib.authentication import UserSetup
from myslice import myslicelibsetup

from myslice.lib.util import format_date

from myslice.db.activity import Event
from myslice.db import connect
from myslice.db.user import User
from myslicelib.query import q


logger = logging.getLogger('myslice.service.users')


def events_run(lock, qPasswordEvents):
    """
    Process the user after approval 
    """

    logger.info("Worker password events starting") 

    dbconnection = connect()

    while True:

        try:
            event = Event(qPasswordEvents.get())
        except Exception as e:
            logger.error("Problem with event: {}".format(e))
        else:
            logger.info("Processing password event from user {}".format(event.user))

            event.setRunning()

            ##
            # Creating a new password for user
            if event.creatingObject():
                logger.info("Creating password {}".format(event.object.id))

                try:
                    cursor = db.users(dbconnection, email=event.data['email'])
                    u = cursor.next()
                    user = User(u)
                    user.password = event.data['password']
                    ret = user.save(dbconnection)
                except Exception as e:
                    logger.error("Problem updating password of user: {} - {}".format(event.object.id, e))
                    event.logError(str(e))
                    event.setError()
                else:
                    event.setSuccess()
            ##
            # we then dispatch the event
            db.dispatch(dbconnection, event)