#
#   MySlice version 2
#
#   Activity process service: manages emails
#
#   (c) 2016 Ciro Scognamiglio <ciro.scognamiglio@lip6.fr>
##

import logging
import signal
import threading
from queue import Queue
from myslice.db import connect, changes
from myslice.db.activity import Event
from myslice.services.workers.emails import emails_run as manageEmails

logger = logging.getLogger('myslice.service.activity')

def receive_signal(signum, stack):
    logger.info('Received signal %s', signum)
    raise SystemExit('Exiting')

def run():
    """

    """
    signal.signal(signal.SIGINT, receive_signal)
    signal.signal(signal.SIGTERM, receive_signal)
    signal.signal(signal.SIGHUP, receive_signal)

    logger.info("Service activity starting")

    qEmails = Queue()

    threads = []
    for y in range(1):
        t = threading.Thread(target=manageEmails, args=(qEmails,))
        t.daemon = True
        threads.append(t)
        t.start()


    feed = changes(table='activity')
    for activity in feed:
        try:
            event = Event(activity['new_val'])
        except Exception as e:
            logger.error("Problem with event: {}".format(e))
        else:
            print(event)

            if event.isPending() and event.notify:
                qEmails.put(event)

            elif event.isDenied() and event.notify:
                logger.info("event {} is denied".format(event.id))
                qEmails.put(event)

            elif event.isSuccess() and event.notify:
                qEmails.put(event)

    # waits for the thread to finish
    for x in threads:
        x.join()