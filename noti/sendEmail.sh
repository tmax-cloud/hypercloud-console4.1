 PRODUCT=hypercloud
 MAJOR_VERSION=4
 MINOR_VERSION=1
 PATCH_VERSION=4
 HOTFIX_VERSION=0
 GUIDE_URL=https://github.com/tmax-cloud/hypercloud-console/blob/hc-dev/install-yaml/hypercloud_console_4.1_install.md
 CHANGELOG="./docs-internal/releases.md"

cp ./noti/config.yaml ./noti/temp-config.yaml
file_temp="./noti/temp-config.yaml"

sed -i "s%@@PRODUCT@@%${PRODUCT}%g" ${file_temp}
sed -i "s%@@MAJOR_VERSION@@%${MAJOR_VERSION}%g" ${file_temp}
sed -i "s%@@MINOR_VERSION@@%${MINOR_VERSION}%g" ${file_temp}
sed -i "s%@@PATCH_VERSION@@%${PATCH_VERSION}%g" ${file_temp}
sed -i "s%@@HOTFIX_VERSION@@%${HOTFIX_VERSION}%g" ${file_temp}
sed -i "s%@@GUIDE_URL@@%${GUIDE_URL}%g" ${file_temp}
sed -i "s%@@CHANGELOG@@%${CHANGELOG}%g" ${file_temp}

./noti/email --config=./noti/temp-config.yaml