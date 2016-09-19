import json

import rethinkdb as r

from myslice.lib.util import myJSONEncoder
from myslice.web.rest import Api

from myslice.db.activity import Event, EventAction, ObjectType
from myslice.db import dispatch

from tornado import gen, escape

class ResourcesHandler(Api):

    @gen.coroutine
    def get(self, id=None, o=None):
        """
            - GET /resources
                (public) resources list

            - GET /resources/<id>
                (public) Resources with <id>

            - GET /resources/<id>/leases
                Leases list of the resource with the <id>
            :return:
            """

        response = []
        current_user = self.get_current_user()

        # GET /resources
        if not id and not o:
            cursor = yield r.table('resources') \
                .run(self.dbconnection)
            while (yield cursor.fetch_next()):
                item = yield cursor.next()
                response.append(item)


        # GET /resources/<id>
        elif not o and id and self.isUrn(id):

            cursor = yield r.table('resources') \
                .filter({'id': id}) \
                .run(self.dbconnection)
            while (yield cursor.fetch_next()):
                item = yield cursor.next()
                response.append(item)
        # GET /resources/<id>/leases
        elif id and self.isUrn(id) and o == 'leases':
            cursor = yield r.table(o) \
                .filter(lambda lease: lease["resources"].contains(id)) \
                .run(self.dbconnection)
                #

            while (yield cursor.fetch_next()):
                item = yield cursor.next()
                response.append(item)
        else:
            self.userError("invalid request")

            return

        self.finish(json.dumps({"result": response}, cls=myJSONEncoder))