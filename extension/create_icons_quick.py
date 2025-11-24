import base64

# Simple 16x16 PNG icon (purple square with white CC)
icon16_base64 = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADRSURBVDiNpdMxSgNBFAbg72XWYBFsBEtbS1vxAIIHsLDyAl7AwtITeIFcQNCzCF5AsbAQBEGwsLKQRRYWdndn3ovFZnYTk8B88GDe/PP+mWH4j1oYYowLXGGKU7zjGY/4wBov2MMSe9jFMcZ4QosubvCJLob/ATo4+QVwiVZT4AYdVLjGgF30G0Cq0cdugMYYNQEaY1gHqHGNboPUqHEeoMYYQ/TwkpU36OElQKOPDi7whl1s4z5AC/d+bBudHfTwhm1kcRug1fh/+AY6TTyevrelGgAAAABJRU5ErkJggg=="

# Simple 32x32 PNG icon
icon32_base64 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGZSURBVFiF7ZYxSwNBEIW/vUtIYWEhWNhZ2tr6H0TwABYWXsALWFh6Ai/gP1DwLIJXCBYWgoKFhYUsLCzs7u7OerEk7CXZJCbBB0Nmd+a92Z3dWfhDlYAa0AJawDlQB+rAGXAONIEWcAHUgApQ/QvABXAJ1IAqUAUqwCVwBVwDN8AtcAfcAw/AI/AEPAMvwCvwBrwDH8An8AV8AzPgB/gF5sAC+AXmi39NVYAK4IEY8MB3BmxRAAKQAhGIQQJSkIEcFCCkgRwUIKKBFGQgBjGIQEABMhCAAAQg+AkgBD4NhCACAQhBAHwasBP/H4BbUwKqBtyaAhCZAiKQmQIikJsCYlNAAnJTQApy0+/rAVcDagyANjAEhsAQ6AMDoA8MgBOgB/SAHtADekAX6AJdoAecAF2gA3SADnACdIA20AbawAnQBo6BFnAMtIBjoAk0gSbQBI6BJtAAGkADaAJNoA40gDrQAOpAA6gDR0AdOALqwBFQA2pADagBNaAGHAE14BCoAYdAHTgE6sAhUAMOgBpwANSAA6AG7P8CfAIiqYg/WLK9vQAAAABJRU5ErkJggg=="

# Simple 128x128 PNG icon
icon128_base64 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADdgAAA3YBfdWCzAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUvSURBVHic7Z1NbtpAFMe/wQnISk5AV1mTblilq6o9AYkbwAm6yQ24AVyAW0TKLqvuuskmC5ZdVaWr9gRplVXpIosqoqJ8+c2bZzzj94OVkYi/mf//zfMYm8wQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEPIXPONnJEmyGwTBThAEu1EUbVmW5TqV5nGfpun2/Px8q1wub1uW5bDMR4n36ADY3+FweHZ2dna8WCyOF4vFseu6m/gU5I5SqbQFv3+hH07Ti/F4fDKbzY5lPI8SL+EA0O8nJyfH8/n8ZLVa7dPXz49yubyJz3sRRdGWZVnO/f39RhzHnuM4tuu6m47jbFmW5biuu+l5Xvn+/r7ieV55Pp8fx3Hslcvl7fl8fuJ5Xtnz/h3zM5nNZieO42xJ+Dx/NwF6nR/HsXd2dnasOQDw62q1OsCf53K5vD2bzU7wOVlR81+vVrsS3oflAPl8/mCxWBxz8ufH931/D5/D1Wp1gD83o9FobPJ+LAdA56/X68PFYnGosfjJbDY7xmcwmUwO8feNaWq+6QDofHT+arU6sO1UEno8Ho/x92d8fmPq1LeTAOh8dL7peT/rfJMOhwPg87oA31/M+/xPCdA4zxuZ91U73zeZAAeBxbyvOgF6ff+wLMvFZ+37fhn/u/H+n4Nv4vm/9oDm+Z2dr/L53XleJQH6fP+Qn/dVJkCf759Zz/sqEqDP98+s531ZCdDn+xdc55uYAH2+fx7XeV9GAvT5/nle53mVCdDn++ednfdlJECf75/3dd6XmQB9vn+BwHleVgL0+f6Fo8/zMhKgz/cvHH2el5EAfb5/ARl53kcC9Pn+hfX5/kVc532RCdDn+xfW5/vnimv+cwL0+f6F9fn+BX3ze54A/b5/1vO+ywTw+/45luf5zwngB/3eFULneRcJ4Id9MYrf9++iTJ/3VSRA3/cXn+ddJkDf9xef510kQN/3F5/nXSaA3/dXZHneVwL4fX+lls/7SgC/76/U9HlfCeD3/bVaPu8rAfp9f+0Tn/eVAH7fX7vF530lgN/3N27xeZ8J4Pf9jVt83mcC+H1/o5aO87wSwO/7G7d1nOeZAH7f37id4zzvIgH8vr9xi8d5XgnQ7/sbtyic52UlgN/3N25ROc/LSkCz76+d5SsB+n1/4xaV87wSoN/3N27ROM8rAfp9f+MWlfO8EqDf9zduUTjPs0pAs++vneUrAfp9f+MWlfOsEsDv+xu3qJzneSSA3/c3blE4z/NIgH7f37hF5TzrBPD7/sYtCud5Vgng9/2NW1TOs0qAft/fuEXhPM8qAfp9f+MWhfM8jwTo9/2NW1TOs0oAv+9v3KJynkcC9Pv+xi0K53keCSh+39+4ReU8jwTw+/7GLSrnWSeAH/TVWr4SwO/7G7c857lIAD/oq7V9JYDf9zducZnn/fQ+8Pv+xi0q5/0sAfp9f+MWhfM8E6Df9zdJeZ/nZSSA3/c3bvFxnpeVAH3fX7vtK+8rAfp9f+OWj7wvKwH6vr9229ff/5UAvv+v1fb195UAfv/fuOUr7/tIgL7/r93ytfeVAH3/37jt6+8rAdy/UWt5+vulAP2+v3HLZ96XkQB9v1+77evvy0oAP/irtXz+fVkJ4Ad/tdZ//v03JkA/86u1fPz9txLAz/1qLb//Xrb/32T+30z839n8/638v7/7/wfQ//+Q/v+h/P9HCiGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCnvgDpMt1yPJE4mMAAAAASUVORK5CYII="

# Write icon files
import os

icons_dir = "icons"
if not os.path.exists(icons_dir):
    os.makedirs(icons_dir)

# Write 16x16 icon
with open(os.path.join(icons_dir, "icon16.png"), "wb") as f:
    f.write(base64.b64decode(icon16_base64))

# Write 32x32 icon
with open(os.path.join(icons_dir, "icon32.png"), "wb") as f:
    f.write(base64.b64decode(icon32_base64))

# Write 48x48 icon (use 32x32 as placeholder)
with open(os.path.join(icons_dir, "icon48.png"), "wb") as f:
    f.write(base64.b64decode(icon32_base64))

# Write 128x128 icon
with open(os.path.join(icons_dir, "icon128.png"), "wb") as f:
    f.write(base64.b64decode(icon128_base64))

print("? All icon files created successfully!")
print("?? Location: " + os.path.abspath(icons_dir))
print("\n?? Next steps:")
print("1. Go to chrome://extensions/")
print("2. Remove old CareerClock extension (if loaded)")
print("3. Click 'Load unpacked'")
print("4. Select the extension folder")
print("5. ? Extension should load without errors!")
