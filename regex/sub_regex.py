#!/usr/bin/env python
from __future__ import with_statement
import re, sys, os

def regex_compile(source):
    files = os.walk(".").next()[2]
    for fn in files:
        parts = fn.split('.')

        if parts[-1].lower() == "re" or parts[-1].lower() == "regex":
            pattern = "%%{%s}" % ('.'.join(parts[:-1]))

            if not pattern in source:
                continue

            with open(fn, 'r') as fh:
                regex = fh.read()

                if regex and regex[-1] == '\n':
                    regex = regex[:-1]

                try:
                    re.compile(regex)
                except StandardError as err:
                    print("Invalid regex in %s: %s" % (fn, err))
                    exit(1)

            source = source.replace(pattern, regex)
    return source

if __name__ == "__main__":
    if len(sys.argv) > 2:
        target = sys.argv[2]
        source = sys.argv[1]
    elif len(sys.argv) > 1:
        target = "master.out"
        source = sys.argv[1]
    else:
        target = "master.out"
        source = "master.regex"

    with open(source, 'r') as fh:
        regex = regex_compile(fh.read())

    if os.path.exists(target):
        print("warn: Overwriting %s..." % target)

    with open(target, 'w+') as fh:
        fh.write(regex)

