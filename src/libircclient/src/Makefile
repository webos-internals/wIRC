# $Id: Makefile.in 84 2009-01-10 01:37:29Z chromerium $
CC = arm-none-linux-gnueabi-gcc
CFLAGS = -Wall -DIN_BUILDING_LIBIRC -g -O2 -O3 -DENABLE_THREADS -D_REENTRANT
AR=arm-none-linux-gnueabi-ar cr
RANLIB=arm-none-linux-gnueabi-ranlib
INCLUDES=-I../include
DESTDIR=


OBJS = libircclient.o

all:	lib

lib:	libircclient.a

install: lib
	-mkdir -p $(DESTDIR)/usr/local/include
	-mkdir -p $(DESTDIR)/usr/local/lib
	cp ../include/libircclient.h $(DESTDIR)/usr/local/include/libircclient.h
	cp ../include/libirc_errors.h $(DESTDIR)/usr/local/include/libirc_errors.h
	cp ../include/libirc_events.h  $(DESTDIR)/usr/local/include/libirc_events.h 
	cp libircclient.a $(DESTDIR)/usr/local/lib/libircclient.a
	cd $(DESTDIR)/usr/local/lib && ln -s libircclient.a libirc.a

$(OBJS): utils.c dcc.c errors.c portable.c sockets.c colors.c

libircclient.a: $(OBJS)
	$(AR) libircclient.a $(OBJS)
	$(RANLIB) libircclient.a

clean:
	rm -f libircclient.a $(OBJS)

distclean: clean
	-rm -f Makefile

.c.o:
	@echo "Compiling  $<"
	@$(CC) $(CFLAGS) $(INCLUDES) -c -o $@ $<
