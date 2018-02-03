#!~/PycharmProjects/__VENV__/venv_fbhack18/bin/python3

import configparser
import ast
import os
import numpy as np

_author_ = 'salmansamie'


class CNFparser:
    config = configparser.ConfigParser()
    config.read(os.path.join('config', 'config.ini'))

    @staticmethod
    def run_timer():
        parse_keys = (CNFparser.config['DEFAULT']['default.avg_speed'])
        return ast.literal_eval(parse_keys)


# 'tme' will take minutes as input once from the user
def ring_dist_function(tme, spd=0.16):
    speed_lst = CNFparser.run_timer()
    dist = float(spd*tme)
    speed_lst.pop(0)
    speed_lst.append(dist)

    CNFparser.config['DEFAULT'] = {
        'default.avg_speed': speed_lst
    }

    with open(os.path.join('config', 'config.ini'), 'w') as fp:
        CNFparser.config.write(fp)
    return speed_lst


def calc_avg(minutes):
    arr = np.asarray(ring_dist_function(minutes))
    return np.average(arr)


if __name__ == '__main__':
    print(calc_avg(5))      # calc_avg(pass_minutes_here)
