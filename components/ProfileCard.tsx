'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge, Button, Card } from "@/components/ui";
import { Edit, Phone, Mail, ChevronRight } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { UserProfile } from "@/types/profile";

const BUCKET = 'profileimages';
const DEFAULT_AVATAR = '/assets/defaultimg.jpg';

function isFullUrl(str?: string) {
  if (!str) return false;
  try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
}

function isSupabaseStorageUrl(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.endsWith('.supabase.co') || u.hostname.endsWith('.supabase.in');
  } catch { return false; }
}

function urlToStoragePath(url: string) {
  try {
    const u = new URL(url);
    const idx = u.pathname.indexOf('/storage/v1/object/');
    if (idx === -1) return null;

    const after = u.pathname.slice(idx + '/storage/v1/object/'.length);
    const cleaned = after.replace(/^public\//, '').replace(/^sign\//, '');
    const bucketPrefix = `${BUCKET}/`;

    if (!cleaned.startsWith(bucketPrefix)) return null;
    return decodeURIComponent(cleaned.slice(bucketPrefix.length));
  } catch {
    return null;
  }
}

async function pathToUrl(path: string, ttlSec = 60 * 60 * 24) {
  const { data: signed, error: signErr } = await supabase
    .storage
    .from(BUCKET)
    .createSignedUrl(path, ttlSec);

  if (!signErr && signed?.signedUrl) {
    return `${signed.signedUrl}${signed.signedUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data?.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : undefined;
}

async function getLatestSignedUrl(userId: string) {
  const { data: files, error } = await supabase
    .storage
    .from(BUCKET)
    .list(userId, { limit: 1, sortBy: { column: 'updated_at', order: 'desc' } });

  if (error || !files?.length) return undefined;
  const path = `${userId}/${files[0].name}`;
  return pathToUrl(path);
}

const ProfileCard = ({
  id,
  firstname,
  lastname,
  username,
  bio,
  phone,
  email,
  tags,
  instagramUrl,
  twitterUrl,
  linkedinUrl,
  image,
}: UserProfile) => {
  const fullName = `${firstname} ${lastname}`;
  const fallbackChar = firstname?.charAt(0) ?? "U";

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (isFullUrl(image) && isSupabaseStorageUrl(image!)) {
        const path = urlToStoragePath(image!);
        const url = path ? await pathToUrl(path) : undefined;
        if (alive) setAvatarUrl(url ?? DEFAULT_AVATAR);
        return;
      }

      if (isFullUrl(image)) {
        if (alive) setAvatarUrl(image!);
        return;
      }

      if (image && id) {
        const path = image.startsWith(`${id}/`) ? image : `${id}/${image}`;
        const url = await pathToUrl(path);
        if (alive) setAvatarUrl(url ?? DEFAULT_AVATAR);
        return;
      }

      if (id) {
        const url = await getLatestSignedUrl(id);
        if (alive) setAvatarUrl(url ?? DEFAULT_AVATAR);
        return;
      }

      if (alive) setAvatarUrl(DEFAULT_AVATAR);
    })();
    return () => { alive = false; };
  }, [id, image]);

  const teamMembers = [
    { id: 1, image: DEFAULT_AVATAR, name: "Team Member 1" },
    { id: 2, image: DEFAULT_AVATAR, name: "Team Member 2" },
    { id: 3, image: DEFAULT_AVATAR, name: "Team Member 3" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Section Title */}
      <div className="col-span-full">
        <div className="flex items-center justify-between bg-profile-card px-4 py-2 rounded-lg">
          <h1 className="text-xl font-semibold text-foreground">My Profile</h1>
        </div>
      </div>

      {/* Left Column - Profile Image */}
      <div className="flex justify-center lg:justify-start">
        <Avatar className="h-64 w-64">
          <AvatarImage
            src={avatarUrl || DEFAULT_AVATAR}
            alt={fullName}
            className="object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR; }}
          />
          <AvatarFallback className="text-4xl">{fallbackChar}</AvatarFallback>
        </Avatar>
      </div>

      {/* Middle Column - Profile Info */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-3xl font-bold text-foreground">{fullName}</h2>
            <Button
              variant="profile"
              size="sm"
              className="gap-2 shrink-0 lg:hidden"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {/* {tags?.[0] && <Badge variant={tags[0].variant}>{tags[0].label}</Badge>} */}
            {username && <p className="text-profile-text-muted text-sm">@{username}</p>}
          </div>
          {bio && <p className="text-sm text-foreground mt-2">{bio}</p>}
        </div>

        {/* Team */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground">Key Team Contacts</span>
            <ChevronRight className="h-4 w-4 text-profile-text-muted" />
          </div>
          <div className="flex gap-2">
            {teamMembers.map((member) => (
              <Avatar key={member.id} className="h-12 w-12 border-2 border-background">
                <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        {/* Tags */}
        <Card className="p-4 space-y-2">
          <h3 className="font-medium text-foreground mb-3">Tags</h3>
          <Badge variant="ar" className="px-4 py-1.5 text-sm rounded-full shadow-sm">
            A&amp;R
          </Badge>
        </Card>
      </div>

      {/* Right Column - Contact & Actions */}
      <div className="space-y-6">
        <div className="hidden lg:flex justify-end">
          <Button variant="profile" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="space-y-4">
          {phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-profile-text-muted" />
              <span className="text-foreground">{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-profile-text-muted" />
              <span className="text-foreground">{email}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mb-2">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition">
              <FaInstagram className="text-xl text-black" />
            </a>
          )}
          {twitterUrl && (
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition">
              <FaTwitter className="text-xl text-black" />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition">
              <FaLinkedin className="text-xl text-black" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
