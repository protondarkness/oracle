total = 0
earlyInvest =0
devs = 0
stake = 0
bought =0
paidEth = 0
burned = 0

def phaseONE(_t,_ei,_d,_s,_b,_p):
    total = _t
    earlyInvest = _t*_ei
    devs = _t*_d
    stake = _s*_t
    bought = _b
    paidEth = _p
    burned = total - stake - bought
    total -= burned

def phaseTWO(_br,_target):

