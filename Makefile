PLUGIN_DIR := src

.PHONY: clean clean-plugin clean-package install

build-package: build-plugin
	pdk-package .

build-plugin:
	cd $(PLUGIN_DIR); make install

clean-package:
	rm -rf *.ipk

clean-plugin:
	cd $(PLUGIN_DIR); make clean

install:
	pdk-install `cat appinfo.json | grep id | cut -f 2 -d ':' | cut -f 2 -d '"'`_`cat appinfo.json | grep version | cut -f 2 -d ':' | cut -f 2 -d '"'`_all.ipk

clean: clean-plugin clean-package
