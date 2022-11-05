import databases

from config import cfg

def database_mysql_url_config():
    return str(cfg.DB_CONNECTION + "://" + cfg.DB_USERNAME + ":" + cfg.DB_PASSWORD +
               "@" + cfg.DB_HOST + ":" + cfg.DB_PORT + "/" + cfg.DB_DATABASE)

database = databases.Database(database_mysql_url_config())