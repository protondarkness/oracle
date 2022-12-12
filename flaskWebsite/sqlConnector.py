import sqlite3


class sqlConnector:

    def __init__(self, dbLocation):
        self.dbLoc = dbLocation
        self.cur = None
        self.conn=None
        self.__getSqlConnect()
        self.__closeSql()

    def __getSqlConnect(self):
        if self.cur is None:
            self.conn = sqlite3.connect(self.dbLoc)
            self.cur = self.conn.cursor()

    def __closeSql(self):
        self.conn.close()
        self.cur = None
        self.conn = None

    def __commitSql(self):
        self.conn.commit()

    def __commitNcloseSql(self):
        if self.conn is not None:
            self.conn.commit()
            self.conn.close()
        self.cur = None
        self.conn = None

    def setDBloc(self,newDB):
        self.dbLoc = newDB

    def sqlexe(self,stmt):
        self.__getSqlConnect()
        self.cur.execute(stmt)
        self.__commitNcloseSql()

    def sqlexeKeepOpen(self, stmt):
        self.__getSqlConnect()
        self.cur.execute(stmt)

    def __dict_factory(self):
        self.conn = sqlite3.connect(self.dbLoc)
        self.conn.row_factory = sqlite3.Row
        self.cur = self.conn.cursor()

    def sqlfetchDict(self,stmt):
        self.__dict_factory()
        res = self.cur.execute(stmt).fetchall()
        self.__closeSql()
        result = [dict(row) for row in res]
        return result

    def sqlfetch(self,stmt):
        self.__getSqlConnect()
        res = self.cur.execute(stmt).fetchall()
        self.__closeSql()
        return res

    def sqlfetchNoClose(self,stmt):
        self.__getSqlConnect()
        res = self.cur.execute(stmt).fetchall()
        return res

    def sqlClose(self):
        self.__closeSql()

    def sqlCommit(self):
        self.__commitSql()

    def sqlexeMany(self,stmt,params):
        self.__getSqlConnect()
        self.cur.executemany(stmt,params)
        self.conn.commit()

    def __getTextString(self, num):
        arr='TEXT'
        for i in range(1,num):
            arr=arr+',TEXT'
        return arr

    def getColsAndValsFromTable(self,tbl):
        s0 = "PRAGMA table_info('{tn}')".format(tn=tbl)
        res = self.sqlfetch(s0)
        cols = []
        vals = []
        for r in res:
            cols.append(r[1])
            vals.append(r[2])
        return cols,vals

    def checkTableExists(self,tabl):
        q = "SELECT name FROM sqlite_master WHERE type='table' AND name='{tn}'".format(tn=tabl)
        t_exist = self.sqlfetch(q)
        if len(t_exist)>0:
            return True
        else:
            return False

    def create_table(self, table_nam, cols, typs, prim=0):
        # E.g., INTEGER, TEXT, NULL, REAL, BLOB
        # Connecting to the database fil
        print(table_nam)
        # Creating a new SQLite table with 1 column
        q = "SELECT name FROM sqlite_master WHERE type='table' AND name='{tn}'".format(tn=table_nam)
        self.__getSqlConnect()
        self.sqlexe(q)
        t_exist = self.sqlfetch(q)
        idx = 0
        if typs == 0:
            typs = self.__getTextString(len(cols))

        if len(t_exist) < 1:
            if isinstance(cols, list):
                print(1)
                if prim != 0:
                    self.sqlexe('CREATE TABLE IF NOT EXISTS {tn} (''id'' INTEGER PRIMARY KEY)' \
                                     .format(tn=table_nam))
                else:
                    self.sqlexe('CREATE TABLE IF NOT EXISTS {tn} (''{nf}'' {ft})' \
                                     .format(tn=table_nam, nf=cols[0], ft=typs[0]))
                    idx += 1
                for counter in range(idx, len(cols)):
                    self.sqlexe("ALTER TABLE {tn} ADD COLUMN '{cn}' {ct}" \
                                     .format(tn=table_nam, cn=cols[counter], ct=typs[counter]))

            else:
                print(2)
                if prim != 0:
                    print(3)
                    self.sqlexe("CREATE TABLE IF NOT EXISTS {tn} ('{nf}' {ft} PRIMARY KEY)" \
                                     .format(tn=table_nam, nf='id', ft='INTEGER'))
                    self.sqlexe("ALTER TABLE {tn} ADD COLUMN '{cn}' {ct}" \
                                     .format(tn=table_nam, cn=cols, ct=typs))
                    print("CREATE TABLE IF NOT EXISTS {tn} ('{nf}' {ft} PRIMARY KEY)" \
                          .format(tn=table_nam, nf=cols, ft=typs))
                else:
                    print(4)
                    self.sqlexe("CREATE TABLE IF NOT EXISTS {tn} ('{nf}' {ft})" \
                                     .format(tn=table_nam, nf=cols, ft=typs))
                    # Committing changes and closing the connection to the database file
        self.__commitNcloseSql()
